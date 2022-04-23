from datetime import datetime, date, time
import math


epoch = datetime(2022,1,1,0,0)
today = datetime.now()

print(today)

d = today - epoch

dayNumber = d.days

quadrants_per_day = 4 * 24

hour_quadrant = today.hour * 4 + math.floor(today.minute / 15)

full_quadrant = dayNumber * quadrants_per_day + hour_quadrant
print(full_quadrant)
