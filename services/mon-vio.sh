#!/bin/bash
source /home/upsquared/git/catkin_ws/devel/setup.bash
sleep 10
mon launch --disable-ui --name=mon_vio /home/upsquared/git/services/mon-vio.launch