docker build -t frigus02/chooser .
docker push frigus02/chooser
kubectl --context gke_me-kuehle_europe-west3-a_website delete pod -l app=chooser
