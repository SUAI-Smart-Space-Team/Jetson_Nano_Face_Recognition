import json

from classes import Point, Camera, Wall


def create_json(cameras: list, room: list, filename: str):
    room_to_json = {'Walls': {}, 'Cameras': {}}

    i = 0
    for wall in room:
        i += 1
        room_to_json['Walls'][str(i)] = wall.make_dict()

    i = 0
    for camera in cameras:
        i += 1
        room_to_json['Cameras'][str(i)] = {'point': camera.point.make_dict(), 'direction': camera.point_to.make_dict()}

    with open(filename, 'w') as fp:
        json.dump(room_to_json, fp, indent='\t')


def read_json(filename: str):
    with open(filename) as json_file:
        room_dict = json.load(json_file)

    walls_data = room_dict['Walls']
    cameras_data = room_dict['Cameras']

    room = []
    for wall in walls_data.values():
        points = []
        for point in wall:
            points.append(Point(point[0], point[1], point[2]))
        room.append(Wall(points))

    cameras = []
    for camera in cameras_data.values():
        cameras.append(Camera(Point(camera['point'][0], camera['point'][1], camera['point'][2]),
                              Point(camera['direction'][0], camera['direction'][1], camera['direction'][2])))

    return room, cameras
