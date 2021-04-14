import unittest
import json
import numpy as np
import searching_real_coordinates
from mpl_toolkits.mplot3d import Axes3D
from matplotlib import pyplot as plt

from classes import Point, Camera
from work_with_json import read_json

class Test_get_coordinates(unittest.TestCase):

	def test_values(self):
		room, cameras = read_json('room.json')

		###
		gt = [Point(1.80, 3.70, 0), Point(1.55, 7.30, 0), Point(3.87, 3.70, 0)]
		camera = cameras[1]
		num_exp = 1
		###

		with open('json_data_from_cameras/data_top_' + str(num_exp) + '.json') as json_file:
			data_from_cameras = json.load(json_file)

		h = data_from_cameras['height']
		w = data_from_cameras['weight']
		j = (data_from_cameras['people'][0]['bbox'][0] + data_from_cameras['people'][0]['bbox'][1]) / 2
		i = (data_from_cameras['people'][0]['bbox'][2] + data_from_cameras['people'][0]['bbox'][3]) / 2
		r = data_from_cameras['people'][0]['depth']

		person_point_real = searching_real_coordinates.get_coordinates(camera=camera, h=h, w=w, j=j, i=i, r=r)
		point = Point(3.87, 3.70, 0)
		point1 = Point(0, 0, 0)
		point2 = Point(-10, -10, -10)
		self.assertNotEqual(person_point_real, point)
		self.assertNotEqual(person_point_real, point1)
		self.assertNotEqual(person_point_real, point2)

