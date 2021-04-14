import numpy as np


class Point:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def __eq__(self, other):
        eps = 1e-4
        return (other.x - eps < self.x < other.x + eps) and \
               (other.y - eps < self.y < other.y + eps) and \
               (other.z - eps < self.z < other.z + eps)

    def __copy__(self):
        return Point(self.x, self.y, self.z)

    def make_dict(self):
        return [self.x, self.y, self.z]


class Wall:
    def __init__(self, points: list):
        self.points = points

    def __copy__(self):
        return Wall(points=self.points)

    def make_dict(self):
        res = []
        for point in self.points:
            res.append(point.make_dict())
        return res

    def make_rectangle(self):
        x = []
        y = []
        z = []

        for point in self.points:
            x.append(point.x)
            y.append(point.y)
            z.append(point.z)

        x.append(self.points[0].x)
        y.append(self.points[0].y)
        z.append(self.points[0].z)

        return np.array(x), np.array(y), np.array(z)


class Camera:
    def __init__(self, point: Point, point_to: Point = None,
                 angle_v: float = None, angle_h: float = None,
                 h=64, v=41, d=77):
        if not point_to and not angle_v and not angle_h:
            exit('Give point_to or angles')

        self.point = point
        self.h = h
        self.v = v
        self.d = d

        if point_to:
            self.point_to = point_to
            self.angle_v, self.angle_h = self.find_angles()
        else:
            self.angle_v = np.mod(angle_v, 360)
            self.angle_h = np.mod(angle_h, 360)
            self.point_to = self.find_point()

    def __eq__(self, other):
        return self.point == other.point

    def __copy__(self):
        return Camera(self.point, self.point_to, self.angle_v, self.angle_h)

    def find_angles(self):
        dx = self.point.x - self.point_to.x
        dy = self.point.y - self.point_to.y
        dz = self.point.z - self.point_to.z

        r = np.sqrt(dx ** 2 + dy ** 2)
        angle_h = np.rad2deg(np.arccos(np.abs(dx) / r))
        angle_v = np.rad2deg(np.arctan(r / np.abs(dz))) if dz != 0 else 90

        if dz < 0:
            angle_v = 180 - angle_v

        if dx < 0 and dy < 0:
            angle_h = 180 - angle_h
        elif dx > 0 and dy > 0:
            angle_h = 360 - angle_h
        elif dy > 0 > dx:
            angle_h = 180 + angle_h

        return angle_v, angle_h

    def find_point(self):
        dz = self.point.z
        r = np.tan(np.radians(self.angle_v)) * self.point.z
        if self.angle_v > 90:
            dz = -dz
            r = np.tan(np.radians(180 - self.angle_v)) * self.point.z
        elif self.angle_v == 90:
            dz = 0
            r = 5

        dx = -np.cos(np.radians(np.mod(self.angle_h, 180))) * r
        dy = np.sqrt(r ** 2 - dx ** 2)
        if self.angle_h >= 180:
            dx = -dx
            dy = -dy

        return Point(self.point.x + dx,
                     self.point.y + dy,
                     self.point.z - dz)
