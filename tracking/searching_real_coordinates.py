import json
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
from matplotlib import pyplot as plt

from classes import Point, Camera
from work_with_json import read_json


def get_coordinates(camera: Camera, h: np.float, w: np.float,
                    j: np.float, i: np.float, r: np.float) -> Point:
    central_point_x = w / 2
    central_point_y = h / 2
    distance_to_person_point_x = np.abs(j - central_point_x)
    distance_to_person_point_y = np.abs(i - central_point_y)
    distance_to_person_point_pix = np.sqrt(distance_to_person_point_x ** 2
                                           + distance_to_person_point_y ** 2)

    camera_vector_len = np.sqrt((camera.point.x - camera.point_to.x) ** 2 +
                                (camera.point.y - camera.point_to.y) ** 2 +
                                (camera.point.z - camera.point_to.z) ** 2)

    def point_from_ratio(point_from, point_to, ratio):
        return Point(point_from.x + (point_to.x - point_from.x) * ratio,
                     point_from.y + (point_to.y - point_from.y) * ratio,
                     point_from.z + (point_to.z - point_from.z) * ratio)

    if distance_to_person_point_pix == 0:
        return point_from_ratio(camera.point, camera.point_to,
                                (r / camera_vector_len))
    else:
        angle_to_person_on_map = np.rad2deg(np.arccos(
            distance_to_person_point_x / distance_to_person_point_pix))
        angle_to_person_in_space = (camera.h / 2) * \
                                   ((2 * distance_to_person_point_pix) / w)
        r_to_center_real = np.cos(np.radians(angle_to_person_in_space)) * r

        distance_to_person_point_real = np.sqrt(r ** 2 -
                                                r_to_center_real ** 2)
        central_point_real = point_from_ratio(camera.point, camera.point_to,
                                              (r_to_center_real / camera_vector_len))

        dxdy = np.sin(np.radians(angle_to_person_on_map)) * distance_to_person_point_real
        gamma = 90 - camera.angle_v if camera.angle_v <= 90 else camera.angle_v - 90
        dz = np.cos(np.radians(gamma)) * dxdy * \
                    (-1 if i - central_point_y > 0 else 1) * \
                    (-1 if camera.angle_v <= 90 else 1)

        dx_from_cam = np.sqrt(dxdy ** 2 - dz ** 2) * (-1 if camera.angle_v <= 90 else 1)

        dy_from_cam = distance_to_person_point_real * (90 - angle_to_person_on_map) / 90

        vector = np.array([dx_from_cam
                           * (-1 if i - central_point_y < 0 else 1),
                           dy_from_cam
                           * (-1 if j - central_point_x < 0 else 1)])

        matrix = np.array([[np.cos(np.radians(360 - camera.angle_h)),
                            -np.sin(np.radians(360 - camera.angle_h))],
                           [np.sin(np.radians(360 - camera.angle_h)),
                            np.cos(np.radians(360 - camera.angle_h))]])

        real_vector = np.dot(matrix, vector)

        return Point(central_point_real.x + real_vector[0],
                     central_point_real.y + real_vector[1],
                     0)


if __name__ == '__main__':
    W = 5.4  # x
    L = 8.8  # y
    H = 2.85  # z

    h_angle = 64
    v_angle = 41
    d_angle = 77

    room, cameras = read_json('room.json')

    ###
    gt = [Point(1.80, 3.70, 0), Point(1.55, 7.30, 0), Point(3.87, 3.70, 0)]
    camera = cameras[1]
    num_exp = 3
    ###

    with open('json_data_from_cameras/data_top_' + str(num_exp) + '.json') as json_file:
        data_from_cameras = json.load(json_file)

    h = data_from_cameras['height']
    w = data_from_cameras['weight']
    j = (data_from_cameras['people'][0]['bbox'][0] + data_from_cameras['people'][0]['bbox'][1]) / 2
    i = (data_from_cameras['people'][0]['bbox'][2] + data_from_cameras['people'][0]['bbox'][3]) / 2
    r = data_from_cameras['people'][0]['depth']

    person_point_real = get_coordinates(camera=camera, h=h, w=w, j=j, i=i, r=r)

    fig = plt.figure()
    ax = Axes3D(fig)

    for wall in room:
        X, Y, Z = wall.make_rectangle()
        ax.plot(X, Y, Z, label='parametric curve', color='k')

    ax.plot(camera.point.x, camera.point.y, camera.point.z, 'ro')
    ax.plot([camera.point.x, camera.point_to.x],
            [camera.point.y, camera.point_to.y],
            [camera.point.z, camera.point_to.z], 'r--')

    ax.plot(gt[num_exp - 1].x, gt[num_exp - 1].y, gt[num_exp - 1].z, 'co')
    ax.plot(person_point_real.x, person_point_real.y, person_point_real.z, 'bo')

    ax.set_xlim3d(0, max(H, W, L))
    ax.set_ylim3d(0, max(H, W, L))
    ax.set_zlim3d(0, max(H, W, L))

    plt.show()

# правильные переводы из вектора в углы и наоборот
# замеры помещения
# получение тестовых данных
# нахождение реальной координаты

# тесты к нахождению реальной координаты
# проверка по этим тестам
