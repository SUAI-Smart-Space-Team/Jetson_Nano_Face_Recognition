# Task
This module is responsible for determining the coordinates of a person in the audience
# Description
The module receives data from cameras in json format as input and converts them into the real coordinate of a person in space
# Usage guide
The configuration file room.json contains the following parameters:
Сoordinates in the configuration file must be specified relative to the point [0,0,0] - start_point , which is located in the corner between the door to the auditorium and the wall
1) example of "wall":
  "Walls": {
		"1": [
			[5.4, 0, 0],
			[5.4, 0, 2.85],
			[0, 0, 2.85],
			[0, 0, 0 ]
		],
		"2": [
			[5.4, 8.8, 0],
			[5.4, 8.8, 2.85],
			[5.4, 0, 2.85],
			[5.4, 0, 0 ]
		],
		"3": [
			[0, 0, 0],
			[0, 0, 2.85],
			[0, 8.8, 2.85],
			[0, 8.8, 0 ]
		],
		"4": [
			[0, 8.8, 0],
			[0, 8.8, 2.85],
			[5.4, 8.8, 2.85],
			[5.4, 8.8, 0 ]]},
  
walls - a parameter that describes a room. Each walls parameter has a value (1-4) and is described by four dots. Points are specified in the format [x, y, z] clockwise, the first point is the bottom left corner of the wall, the last point is the bottom right corner.
![image](https://user-images.githubusercontent.com/56771735/114852858-d87edc00-9deb-11eb-81ef-c1c2fa27bc7f.png)



The numbering of the walls is not important. 


2) "Cameras": {
		"1": {
			"point": [
				3.94,
				0.53,
				1.67
			],
			"direction": [
				1.748144266054613,
				5.023970231495835,
				1.67
			]
		},
		"2": {
			"point": [
				2.7,
				0.05,
				2.8
			],
			"direction": [
				2.6999999999999997,
				6.054619377426763,
				0.0
			]
		}
	}
The configuration file stores values for two cameras("1", "2")
	1) "point" - parameter written in the format Point [x, y, z] relative to start_point, which indicates the location of the camera relative to start_point 
	2) "direction" - parameter written in the format Point [x, y, z] relative to start_point, which indicates the point on the virtual plane to which the camera is directed
It is necessary to create an object of the camera class stored in the classes.py file and pass two corners as parameters. The first is the angle between the x and y axes (angle _h), the second is the angle between the y and z axes
![Скриншот 15-04-2021 131955](https://user-images.githubusercontent.com/56771735/114854531-96569a00-9ded-11eb-8435-913f831abb80.png)
![2](https://user-images.githubusercontent.com/56771735/114854538-98205d80-9ded-11eb-896c-0c9a565853bf.png)


In order to get the point to which the camera is directed, you need to call the find_point method, which will return the point value in the format [x, y, z]
