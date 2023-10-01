# foodstats-client

deployed at https://foodstats.net/

deployment instructions:
1. on local machine, build with `npm run build`
2. copy all files from build directory to server content store
```shell
scp -r ~/foodstats-client/build/* root@146.190.40.243:/var/www/foodstats.net/html
```
