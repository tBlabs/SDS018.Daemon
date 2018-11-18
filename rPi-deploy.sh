curl -o node_v9.11.1.tar.gz http://nodejs.org/dist/v9.11.1/node-v9.11.1-linux-armv6l.tar.gz 
tar -xzf node_v9.11.1.tar.gz
sudo cp -r node-v9.11.1-linux-armv6l/* /usr/local/
node -v
npm -v