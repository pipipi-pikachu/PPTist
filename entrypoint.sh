echo "NODE_ENV->$NODE_ENV"

echo "Building PPTist frontend"
npm run build

echo "Starting production server"
exec node server