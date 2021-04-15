# Task
This module is responsible for determining the coordinates of a person in the audience
# Description
The module receives data from cameras in json format as input and converts them into the real coordinate of a person in space
# Usage guide
In the configuration file, room.json is set in the following format:
Each wall is set by four coordinates, values are set clockwise from the lower left corner
Each camera is set by two parameters:
1) point - coordinates of the camera location
2) 'direction' sets the direction of the camera. The values in the required format can be obtained by creating an object of the Camera class, which receives 2 corners as parameters. angle_h - the angle between the x and y axes. angle_v - the angle between the y and z axes. Then you need to run the find_point method, which returns an object of the Point class.
