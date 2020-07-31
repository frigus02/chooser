docker build -t frigus02/chooser .
docker push frigus02/chooser
kubectl --context kubesail-frigus02 delete pod -l app=chooser
