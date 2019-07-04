#!/bin/bash
source /home/upsquared/git/catkin_ws/devel/setup.bash
sleep 5
mon launch --disable-ui --log=/home/upsquared/.ros/log/mon-drivers.log --name=mon_drivers /home/upsquared/git/services/mon-drivers.launch