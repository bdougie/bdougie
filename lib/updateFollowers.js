module.exports = { updateFollowerCount };

function updateFollowerCount(content, count) {
  return content.replace(
    /<!-- follower-counter -->(\d+)<!-- \/follower-counter -->/,
      `<!-- follower-counter -->${count}<!-- /follower-counter -->`
  );
}
