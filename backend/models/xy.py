class XY:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    @staticmethod
    def from_dict(dict):
        return XY(dict['x'], dict['y'])
    
    x: int
    y: int
    