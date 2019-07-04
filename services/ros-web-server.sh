#!/bin/bash
source /home/upsquared/git/catkin_ws/devel/setup.bash
sleep 5
mon launch --disable-ui --name=web_server /home/upsquared/git/services/ros-web-server.launch