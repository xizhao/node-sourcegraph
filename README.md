### WIP.

Simple node api client for sourcegraph.  Unofficial, WIP.

```
npm install node-sourcegraph
```

AGPL-Licensed.  

Jk, it's MIT.

## Examples

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