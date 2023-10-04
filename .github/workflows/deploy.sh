#!/bin/bash

# Define variables
REMOTE_HOST=`${{secrets.REMOTE_IP}}`
REMOTE_USER=`${{ secrets.REMOTE_USERNAME }}`
REMOTE_DIR=`C:\Users\MetaorangeAdmin\Desktop\cicd`

# Copy the code to the remote desktop
scp -r ./* "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"

# Optional: Restart your application or perform other deployment tasks
# ssh "${REMOTE_USER}@${REMOTE_HOST}" "cd ${REMOTE_DIR} && ./restart.sh"
