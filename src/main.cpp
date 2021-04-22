#include <curl/curl.h>
#include <iostream>
#include <opencv2/opencv.hpp>
#include "TMtCNN.h"
#include "TArcface.h"
#include "TRetina.h"
#include "TWarp.h"
#include "TLive.h"
#include "TBlur.h"
#include <ctime>


//----------------------------------------------------------------------------------------
//
// Created by markson zhang
//
// Edited by Xinghao Chen 2020/7/27
//
// Modified by Q-engineering 2020/12/28
//
//----------------------------------------------------------------------------------------
// Build defines
// comment them to turn a function off
//----------------------------------------------------------------------------------------
//#define RETINA                  //comment if you want to use MtCNN landmark detection instead
#define RECOGNIZE_FACE
//#define TEST_LIVING
#define AUTO_FILL_DATABASE
#define BLUR_FILTER_STRANGER
// some diagnostics
//#define SHOW_LEGEND
//#define SHOW_LANDMARKS
//----------------------------------------------------------------------------------------
// Adjustable Parameters
//----------------------------------------------------------------------------------------
const int   MaxItemsDatabase = 2000;
const int   MinHeightFace    = 30;
const float MinFaceThreshold = 0.50;
const float FaceLiving       = 0.93;
const double MaxBlur         = -25.0;   //more positive = sharper image
const double MaxAngle        = 10.0;
//----------------------------------------------------------------------------------------
// Some globals
//----------------------------------------------------------------------------------------
const int   RetinaWidth      = 320;
const int   RetinaHeight     = 240;
float ScaleX, ScaleY;
vector<cv::String> NameFaces;
//----------------------------------------------------------------------------------------
using namespace std;
using namespace cv;
//----------------------------------------------------------------------------------------
//  Computing the cosine distance between input feature and ground truth feature
//----------------------------------------------------------------------------------------
inline float CosineDistance(const cv::Mat &v1, const cv::Mat &v2)
{
    double dot = v1.dot(v2);
    double denom_v1 = norm(v1);
    double denom_v2 = norm(v2);
    return dot / (denom_v1 * denom_v2);
}
//----------------------------------------------------------------------------------------
// painting
//----------------------------------------------------------------------------------------
void DrawObjects(cv::Mat &frame, vector<FaceObject> &Faces)
{
    for(size_t i=0; i < Faces.size(); i++){
        FaceObject& obj = Faces[i];

//----- rectangle around the face -------
        obj.rect.x *= ScaleX;
        obj.rect.y *= ScaleY;
        obj.rect.width *= ScaleX;
        obj.rect.height*= ScaleY;
        cv::rectangle(frame, obj.rect, cv::Scalar(0, 255, 0));
//---------------------------------------

//----- diagnostic ----------------------
#ifdef SHOW_LANDMARKS
        for(int u=0;u<5;u++){
            obj.landmark[u].x*=ScaleX;
            obj.landmark[u].y*=ScaleY;
        }

        cv::circle(frame, obj.landmark[0], 2, cv::Scalar(0, 255, 255), -1);
        cv::circle(frame, obj.landmark[1], 2, cv::Scalar(0, 255, 255), -1);
        cv::circle(frame, obj.landmark[2], 2, cv::Scalar(0, 255, 255), -1);
        cv::circle(frame, obj.landmark[3], 2, cv::Scalar(0, 255, 255), -1);
        cv::circle(frame, obj.landmark[4], 2, cv::Scalar(0, 255, 255), -1);
#endif // SHOW_LANDMARKS
//---------------------------------------
#ifdef SHOW_LEGEND
        cv::putText(frame, cv::format("Angle : %0.1f", obj.Angle),cv::Point(10,40),cv::FONT_HERSHEY_SIMPLEX,0.6, cv::Scalar(180, 180, 0));
        cv::putText(frame, cv::format("Face prob : %0.4f", obj.FaceProb),cv::Point(10,60),cv::FONT_HERSHEY_SIMPLEX,0.6, cv::Scalar(180, 180, 0));
        cv::putText(frame, cv::format("Name prob : %0.4f", obj.NameProb),cv::Point(10,80),cv::FONT_HERSHEY_SIMPLEX,0.6, cv::Scalar(180, 180, 0));
#ifdef TEST_LIVING
        if(obj.Color==2){
            //face is too tiny
            cv::putText(frame, cv::format("Live prob : ??"),cv::Point(10,100),cv::FONT_HERSHEY_SIMPLEX,0.6, cv::Scalar(180, 180, 0));
        }
        else{
            //face is ok
            cv::putText(frame, cv::format("Live prob : %0.4f", obj.LiveProb),cv::Point(10,100),cv::FONT_HERSHEY_SIMPLEX,0.6, cv::Scalar(180, 180, 0));
        }
#endif // TEST_LIVING
#endif // SHOW_LEGEND
//----- labels ----------------------------
#ifdef RECOGNIZE_FACE
        cv::String Str;
        cv::Scalar color;
        int  baseLine = 0;

        switch(obj.Color){
            case 0 : color = cv::Scalar(255, 255, 255); break;  //default white -> face ok
            case 1 : color = cv::Scalar( 80, 255, 255); break;  //yellow -> stranger
            case 2 : color = cv::Scalar(255, 237, 178); break;  //blue -> too tiny
            case 3 : color = cv::Scalar(127, 127, 255); break;  //red -> fake
            default: color = cv::Scalar(255, 255, 255);
        }

        switch(obj.NameIndex){
            case -1: Str="Stranger"; break;
            case -2: Str="too tiny"; break;
            case -3: Str="Fake !";   break;
            default: Str=NameFaces[obj.NameIndex];
        }

        cv::Size label_size = cv::getTextSize(Str, cv::FONT_HERSHEY_SIMPLEX, 0.6, 1, &baseLine);
        int x = obj.rect.x;
        int y = obj.rect.y - label_size.height - baseLine;
        if(y<0) y = 0;
        if(x+label_size.width > frame.cols) x=frame.cols-label_size.width;

        cv::rectangle(frame, cv::Rect(cv::Point(x, y), cv::Size(label_size.width, label_size.height + baseLine)),color, -1);
        cv::putText(frame, Str, cv::Point(x, y+label_size.height+2),cv::FONT_HERSHEY_SIMPLEX, 0.6, cv::Scalar(0, 0, 0));
#endif // RECOGNIZE_FACE
    }
}

void printTime(){
    struct tm *u;
    char s1[40] = {0};
    const time_t timer = time(NULL);
    u = localtime(&timer);
    strftime(s1, 80, "%d.%m.%Y %H:%M:%S ", u);
    cout << s1;
}

struct WriteThis {
  char* readptr;
  size_t sizeleft;
};

static size_t read_callback(char *dest, size_t size, size_t nmemb, void *userp)
{
    struct WriteThis *wt = (struct WriteThis *)userp;
    size_t buffer_size = size*nmemb;

    if(wt->sizeleft) {
        /* copy as much as possible from the source to the destination */
        size_t copy_this_much = wt->sizeleft;
        if(copy_this_much > buffer_size)
            copy_this_much = buffer_size;
        memcpy(dest, wt->readptr, copy_this_much);

        wt->readptr += copy_this_much;
        wt->sizeleft -= copy_this_much;
        return copy_this_much; /* we copied this many bytes */
    }
    return 0; /* no more data left to deliver */
}

size_t write_data(void *buffer, size_t size, size_t nmemb, void *userp)
{
    return size * nmemb;
}

void sendId(string Id){
    CURL *curl;
    struct WriteThis wt;

    string s("{\"id\":");
    if (Id.size() > 0) {
        cv::String Str = Id;
        int n   = Str.rfind('/');
        Str = Str.erase(0,n+1);
        n   = Str.find('#');
        if(n>0) Str = Str.erase(n,Str.length()-1);                //remove # some numbers.jpg
        else    Str = Str.erase(Str.length()-4, Str.length()-1);  //remove .jpg
        s += "\"";
        s += Str;
        s += "\"";
    } else {
        s += "null";
    }
    s += "}";
    cout << s;
    char* data = (char*) s.c_str();
    wt.readptr = data;
    wt.sizeleft = strlen(data);

    curl = curl_easy_init();
    struct curl_slist *headers = NULL;

    headers = curl_slist_append(headers, "Content-Type: text/plain");
    headers = curl_slist_append(headers, "mode: no-cors");
    headers = curl_slist_append(headers, "charset: utf-8");

    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:8080");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    curl_easy_setopt(curl, CURLOPT_READFUNCTION, read_callback);
    curl_easy_setopt(curl, CURLOPT_READDATA, &wt);
    curl_easy_setopt(curl, CURLOPT_VERBOSE, 0L);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, (long)wt.sizeleft);
    curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    curl_global_cleanup();
}
//----------------------------------------------------------------------------------------
// main
//----------------------------------------------------------------------------------------
int main(int argc, char **argv)
{
    sendId("");
    printTime();
    cout << endl;
    float f;
    float FPS[16];
    int   Fcnt=0;
    size_t i;
    cv::Mat frame;
    cv::Mat result_cnn;
    cv::Mat faces;
    std::vector<FaceObject> Faces;
    vector<cv::Mat> fc1;
    string pattern_jpg = "./jetson_recognized/*.jpg";
    string pattern_crp_jpg = "./jetson_crop/*.jpg";
    cv::String NewItemName;
    size_t FaceCnt;
    //the networks
    TLive Live;
    TWarp Warp;
    TMtCNN MtCNN;
    TArcFace ArcFace;
    TRetina Rtn(RetinaWidth, RetinaHeight, false);     //no Vulkan support on a RPi
    TBlur Blur;
    //some timing
    chrono::steady_clock::time_point Tbegin, Tend;
    Live.LoadModel();

    for(i=0;i<16;i++) FPS[i]=0.0;

    //OpenCV Version
    cout << "OpenCV Version: " << CV_MAJOR_VERSION << "." << CV_MINOR_VERSION << "."
    << CV_SUBMINOR_VERSION << endl;
    cout << " " << endl;

#ifdef RECOGNIZE_FACE
    cout << "Trying to recognize faces" << endl;
    cout << " " << endl;
#ifdef RETINA
    cout << "Using Retina" << endl;
    cout << " " << endl;
#else
    cout << "Using MtCNN" << endl;
    cout << " " << endl;
#endif // RETINA

#ifdef TEST_LIVING
    cout << "Test living or fake fave" << endl;
    cout << " " << endl;
#endif // TEST_LIVING

#ifdef AUTO_FILL_DATABASE
    cout << "Automatic adding strangers to database" << endl;
    cout << " " << endl;
#ifdef BLUR_FILTER_STRANGER
    cout << "Blur filter - only sharp images to database" << endl;
    cout << " " << endl;
#endif // BLUR_FILTER_STRANGER
#endif // AUTO_FILL_DATABASE
#endif // RECOGNIZE_FACE

    //if you like to load a picture of a face into the database
    //give the name of the .jpg image as argument on the command line
    //without arguments the app will run the .mp4 video or use the camera



    //loading the faces
	cv::glob(pattern_jpg, NameFaces);
    FaceCnt=NameFaces.size();
	if(FaceCnt==0) {
		cout << "No image files[jpg] in database" << endl;
	}
	else{
        cout << "Found "<< FaceCnt << " pictures in database." << endl;
        for(i=0; i<FaceCnt; i++){
            //convert to landmark vector and store into fc
            faces = cv::imread(NameFaces[i]);
            fc1.push_back(ArcFace.GetFeature(faces));
        }
        cout << "" << endl;
        cout << "Loaded "<<FaceCnt<<" faces in total"<<endl;
    }

    std::vector<int> Timers(FaceCnt);
    for(i=0; i<FaceCnt; i++){
        Timers[i] = time(NULL);
    }
    int TimerDelay = 3;
    int curDelay = time(NULL);

    // RaspiCam or Norton_2.mp4 ?
   // cv::VideoCapture cap(0);             //RaspiCam
   //cv::VideoCapture cap("Norton_A.mp4");   //Movie

   //int capture_width,capture_height,display_width,display_height,framerate,flip_method;
   VideoCapture cap=cv::VideoCapture("nvarguscamerasrc ! video/x-raw(memory:NVMM), width=(int)640, height=(int)480, format=(string)NV12, framerate=(fraction)60/1 ! nvvidconv flip-method=2 ! video/x-raw, width=(int)640, height=(int)480, format=(string)BGRx ! videoconvert ! video/x-raw, format=(string)BGR ! appsink", cv::CAP_GSTREAMER);
 // cv::VideoCapture cap(capture_width=1280,capture_height=720,display_width=1280,display_height=720,framerate=60,flip_method=0, cv2.CAP_GSTREAMER);
    if (!cap.isOpened()) {
        cerr << "ERROR: Unable to open the camera" << endl;
        return 0;
    }
    cout << "Start grabbing, press ESC on TLive window to terminate" << endl;
    while(1){
        if (curDelay + TimerDelay < time(NULL)) {
            curDelay = time(NULL);
            cv::glob(pattern_jpg, NameFaces);
            size_t newFaceCnt = NameFaces.size();
            if (newFaceCnt != FaceCnt) {
                cout << "Base update" << endl;
                FaceCnt=newFaceCnt;
                Timers.resize(0);
                fc1.resize(0);
                for(i=0; i<FaceCnt; i++){
                    //convert to landmark vector and store into fc
                    faces = cv::imread(NameFaces[i]);
                    fc1.push_back(ArcFace.GetFeature(faces));
                }
                for(i=0; i<FaceCnt; i++){
                    Timers[i] = time(NULL);
                }
            }
            cv::glob(pattern_crp_jpg, NameFaces);
            if (NameFaces.size() > 0){

                cv::Mat frame = cv::imread(NameFaces[0], 1);
                //extract
                ScaleX = ((float) frame.cols) / RetinaWidth;
                ScaleY = ((float) frame.rows) / RetinaHeight;
                // copy/resize image to result_cnn as input tensor
                cv::resize(frame, result_cnn, Size(RetinaWidth,RetinaHeight),INTER_LINEAR);
                //get the face
                Rtn.detect_retinaface(result_cnn,Faces);
                //only one face per picture
                if(Faces.size()==1){
                    if(Faces[0].FaceProb>MinFaceThreshold){
                        //get centre aligned image
                        cv::Mat aligned = Warp.Process(result_cnn,Faces[0]);

                        cv::String Str = NameFaces[0];
                        int n   = Str.rfind('/');
                        Str = Str.erase(0,n+1);
                        Str = Str.erase(Str.length()-4, Str.length()-1);  //remove .jpg


                        imwrite("./img/"+Str+".jpg", aligned);
                        cout << "Stored to database : " << Str << endl;
                    }
                }
            }
        }
        cap >> frame;
        if (frame.empty()) {
            cerr << "End of movie" << endl;
            break;
        }
        ScaleX = ((float) frame.cols) / RetinaWidth;
        ScaleY = ((float) frame.rows) / RetinaHeight;

        // copy/resize image to result_cnn as input tensor
        cv::resize(frame, result_cnn, Size(RetinaWidth,RetinaHeight),INTER_LINEAR);
        Tbegin = chrono::steady_clock::now();

#ifdef RETINA
        Rtn.detect_retinaface(result_cnn,Faces);
#else
        MtCNN.detect(result_cnn,Faces);
#endif // RETINA

#ifdef RECOGNIZE_FACE
        //reset indicators
        for(i=0;i<Faces.size();i++){
            Faces[i].NameIndex = -2;    //-2 -> too tiny (may be negative to signal the drawing)
            Faces[i].Color     =  2;
            Faces[i].NameProb  = 0.0;
            Faces[i].LiveProb  = 0.0;
        }
        //run through the faces only when you got one face.
        //more faces (if large enough) are not a problem
        //in this app with an input image of 324x240, they become too tiny
        if(Faces.size()==1){
            //looks stupid, running through a loop of size 1
            //however, for your convenience using [i]
            for(i=0;i<Faces.size();i++){
                if(Faces[i].FaceProb>MinFaceThreshold){
                    //get centre aligned image
                    cv::Mat aligned = Warp.Process(result_cnn,Faces[i]);
                    Faces[i].Angle  = Warp.Angle;
                    //features of camera image
                    cv::Mat fc2 = ArcFace.GetFeature(aligned);
                    //reset indicators
                    Faces[i].NameIndex = -1;    //a stranger
                    Faces[i].Color     =  1;
                    //the similarity score
                    if(FaceCnt>0){
                        vector<double> score_;
                        for(size_t c=0;c<FaceCnt;c++) score_.push_back(CosineDistance(fc1[c], fc2));
                        int Pmax = max_element(score_.begin(),score_.end()) - score_.begin();
                        Faces[i].NameIndex = Pmax;
                        Faces[i].NameProb  = score_[Pmax];
                        score_.clear();

                            //recognize a face
                        if(Faces[i].rect.height < MinHeightFace){
                            Faces[i].Color = 2; //found face in database, but too tiny
                            sendId("");
                        }
                        else {
                            if(Faces[i].NameProb >= MinFaceThreshold){
                                Faces[i].Color = 0; //found face in database and of good size
                                if(Timers[Pmax] + TimerDelay < time(NULL)){
                                    // Send info result_cnn, aligned, NameFaces[Pmax]
                                    Timers[Pmax] = time(NULL);
                                    sendId(NameFaces[Pmax]);
                                    printTime();
                                    cout << " Hello: " << NameFaces[Pmax] << endl;
                                }
                            }
                            else{
                                Faces[i].NameIndex = -1;    //a stranger
                                Faces[i].Color     =  1;
                            }
                        }

                    }

                    //test if the face is recognized, or should it be added to database
                    if(Faces[i].NameIndex == -1){
                        if(Faces[i].rect.height < MinHeightFace){
                            //a stranger with a small face
                            Faces[i].Color = 2; //too tiny
                        }
#ifdef AUTO_FILL_DATABASE
                        else{
                            //a stranger with a large face, who can be added to the database
                            if(FaceCnt>=MaxItemsDatabase){
                                cout << "Database full !" << endl;
                            }
                            else{
                                double blur=0.0;
#ifdef BLUR_FILTER_STRANGER
                                blur=Blur.Execute(aligned);
#endif // BLUR_FILTER_STRANGER
                                if(Warp.Angle<=MaxAngle && blur>=MaxBlur){
//                                cout <<"Probability : " << Faces[i].FaceProb << "   Angle : " << Warp.Angle << "   Blur : " << blur << endl;
//                                cv::imshow("Add",aligned);
                                    imwrite("./jetson_tmp/photo.jpg", result_cnn);
                                    imwrite("./jetson_tmp/croped.jpg", aligned);
                                    printTime();
                                    cout << "New face found" << endl;
                                    sendId("");
                                }
                            }
                        }
#endif // AUTO_FILL_DATABASE
                    }
                }
            }
        }
#endif // RECOGNIZE_FACE

        Tend = chrono::steady_clock::now();

        DrawObjects(frame, Faces);

        //calculate frame rate
        f = chrono::duration_cast <chrono::milliseconds> (Tend - Tbegin).count();
        if(f>0.0) FPS[((Fcnt++)&0x0F)]=1000.0/f;
        for(f=0.0, i=0;i<16;i++){ f+=FPS[i]; }
        cv::putText(frame, cv::format("FPS %0.2f", f/16),cv::Point(10,20),cv::FONT_HERSHEY_SIMPLEX,0.6, cv::Scalar(180, 180, 0));

        //show output
        cv::imshow("Jetson Nano - 2014.5 MHz", frame);
        char esc = cv::waitKey(5);
        if(esc == 27) break;
    }

    cv::destroyAllWindows();

    return 0;
}
