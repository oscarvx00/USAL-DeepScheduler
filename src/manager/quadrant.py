from datetime import datetime, date, time, timezone
import math


def getCurrentQuadrant():
    #Declare init epoch
    epoch = datetime(2022,1,1,0,0, tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)

    day_number = (now - epoch).days
    quadrants_per_day = 4 * 24
    hour_quadrant = now.hour * 4 + math.floor(now.minute / 15)

    return day_number * quadrants_per_day + hour_quadrant

print(getCurrentQuadrant())
