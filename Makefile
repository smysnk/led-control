IP?=192.168.0.117
ROOT?=led-control
SHELL=/bin/bash -eo pipefail
COMMAND?=none

sync:
	rsync . pi@${IP}:~/${ROOT} -r --verbose --exclude=node_modules --exclude=interface --exclude public --exclude=.git --delete

command: sync
	ssh pi@${IP} " \
	 cd ${ROOT}; \
	 npm install ${COMMAND};"

install: sync
	ssh pi@${IP} " \
	 cd ${ROOT}; \
	 npm install && npm install rpi-ws281x;"

setup:
	ssh pi@${IP} "sudo apt-get update; \
		sudo apt-get install -y npm;"

exec: sync
	ssh pi@${IP} " \
	 cd ${ROOT}; \
	 sudo killall -9 node; \
	 sleep 5; \
	 sudo npm start"

remote-dev: sync
	ssh pi@${IP} " \
	 cd ${ROOT}; \
	 sudo killall -9 node; \
	 sleep 5; \
	 sudo npm start"

remote-watch:
	nodemon -L --ignore node_modules -w . --exec make remote-dev
