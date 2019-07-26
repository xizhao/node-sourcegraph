### WIP.

Simple node api client for sourcegraph.  Unofficial, WIP.

```
npm install node-sourcegraph
```

AGPL-Licensed.  

Jk, it's MIT.

## Examples
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fxizhao%2Fnode-sourcegraph.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fxizhao%2Fnode-sourcegraph?ref=badge_shield)


```
var sourcegraph = require('sourcegraph');
sourcegraph.repos.get('github.com/learnboost/mongoose', function(err, doc) {
	if(err) throw err;
	console.log(doc);
});
```

Output:

```
{ RID: 111891,
  URI: 'github.com/LearnBoost/mongoose',
  Name: 'mongoose',
  OwnerUserID: 271,
  OwnerGitHubUserID: 204174,
  Description: 'MongoDB object modeling designed to work in an asynchronous environment.',
  VCS: 'git',
  CloneURL: 'https://github.com/LearnBoost/mongoose.git',
  ActualCloneURL: null,
  HomepageURL: 'http://mongoosejs.com',
  DefaultBranch: 'master',
  Language: 'JavaScript',
  GitHubStars: 5632,
  GitHubID: 597879,
  Deprecated: false,
  Fork: false,
  Mirror: false,
  Private: false,
  Stat: null }
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fxizhao%2Fnode-sourcegraph.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fxizhao%2Fnode-sourcegraph?ref=badge_large)