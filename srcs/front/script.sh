#!/bin/ash
sleep 10
npm install -g npm@10.9.0
npm audit fix
npm install
npm install bootstrap@5.3.2
npm install bootstrap-icons
npm install jwt-decode
npm run dev -- --host