#!/bin/bash

# Move contents from portfolio/build into repository louislefevre.github.io
# and pushes to GitHub.

HERE=$(pwd)
REPO=louislefevre.github.io

echo "Generating production build..."
npm run production

cd ..

if [ ! -d "$REPO" ]; then
  echo "Creating repository at $(pwd)/$REPO"
  git clone https://github.com/louislefevre/$REPO.git
fi

echo "Removing old build..."
cd $REPO
git rm -r .

echo "Moving new build..."
mv $HERE/build/* .

echo "Committing to Git..."
git add .
git commit -m "Website build"

while true; do
  read -p "Push to $REPO repository? [yes/no]" yn
  case $yn in
    [Yy]* ) git push; break;;
    [Nn]* ) echo "Exiting..."; exit;;
        * ) echo "Please answer yes or no.";;
  esac
done
