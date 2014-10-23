var url = require('url'),
		querystring = require('querystring');

//https://sourcegraph.com/sourcegraph.com/sourcegraph/go-sourcegraph@master/.GoPackage/sourcegraph.com/sourcegraph/go-sourcegraph/sourcegraph/.def/RepoSpec

module.exports = function(makeRegistrar) {
	var registerRepoMethod = makeRegistrar("repos", 'repos');

	function parseRepoSpec(repo_id) {
		if(typeof repo_id === "number") {
			return 'R$' + repo_id;
		} else if(typeof repo_id === "string") {
			return repo_id;
		} else {
			throw new Error("Invalid Repository Identifier.");
		}
	}

	///(R$111891|url)(?:@)(?:(master===))(a231a1a7e58ef23694f6a44498e62462f080b8cd)
	function parseRevSpec(revision, commit_id) {
		if(commit_id) {
			if(!revision) throw new Error("Invalid revision but non-empty Commit ID (" + commit_id + ")");
			return revision + '===' + commit_id;
		}
		return revision || '';
	}

	function parseRepoRevSpec(repo_id, revision, commit_id) {
		var rev_string = parseRevSpec(revision, commit_id);
		return parseRepoSpec(repo_id) + (rev_string ? '@' : '') + rev_string;
	}

	// Fetch a repository.
	// USAGE: sourcegraph.repos.get(repo_id)
	// ROUTE: GET /api/repos/{RepoSpec}
	// EX: .repos.get(1104, cb) OR .repos.get('github.com/learnboost/mongoose', cb)
	registerRepoMethod("get", function(repo_id) {
		this.path += parseRepoSpec(repo_id);
	});

	// Get statistics about a repository at a specific commit. 
	// USAGE: sourcegraph.repos.stats(repo_id, [revision], [commit_id])
	// ROUTE: GET /api/repos/{RepoSpec}/.stats
	// EX: .repos.stats()
	registerRepoMethod("stats", function(repo_id, revision, commit_id) {
		this.path += parseRepoRevSpec(repo_id, revision, commit_id) + '/.stats';
	});

	// Fetch a repository using Get. If no such repository exists
	// with the URI, and the URI refers to a recognized repository host (such as
	// github.com), the repository's information is fetched from the external
	// host and the repository is created.
	// USAGE: sourcegraph.repos.get_or_create(repo_id, [include_stats])
	// ROUTE: PUT /api/repos/{RepoSpec}?Stats={include_stats}
	registerRepoMethod("get_or_create", function(repo_id, include_stats) {
		this.path += parseRepoSpec(repo_id) + '?Stats=' + (!!include_stats).toString(); 
	}, "PUT");

	// Fetch a repository's configuration settings.
	// USAGE: sourcegraph.repos.settings(repo_id)
	// ROUTE: GET /api/repos/{RepoSpec}/.settings
	registerRepoMethod("settings", function(repo_id) {
		this.path += parseRepoSpec(repo_id) + '/.settings'; 
	});

	// UpdateSettings updates a repository's configuration settings.
	// USAGE: sourcegraph.repos.update_settings(repo_id, [enabled])
	// ROUTE: PUT /api/repos/{RepoSpec}/.settings?Enabled={enabled}
	registerRepoMethod("update_settings", function(repo_id, enabled) {
		this.path += parseRepoSpec(repo_id) + '/.settings?Enabled=' + (!!enabled).toString(); 
	}, "PUT");

	// Updates the repository metadata for a repository, fetching it from an external host if the host is recognized (such as GitHub).
	// USAGE: sourcegraph.repos.refresh_profile(repo_id)
	// ROUTE: PUT /api/repos/{RepoSpec}/.external-profile
	registerRepoMethod("refresh_profile", function(repo_id) {
		this.path += parseRepoSpec(repo_id) + '/.external-profile'; 
	}, "PUT");

	// Update the repository VCS (git/hg) data, fetching all new commits, branches, tags, and blobs.
	// USAGE: sourcegraph.repos.refresh_vcs_data(repo_id)
	// ROUTE: PUT /api/repos/{RepoSpec}/.vcs-data
	registerRepoMethod("refresh_vcs_data", function(repo_id) {
		this.path += parseRepoSpec(repo_id) + '/.vcs-data'; 
	}, "PUT");

	// Ping server to update the statistics about a repository.
	// USAGE: sourcegraph.repos.compute_stats(repo_id, [revision], [commit_id])
	// ROUTE: POST /api/repos/{RepoSpec}/.stats
	registerRepoMethod("compute_stats", function(repo_id, revision, commit_id) {
		this.path += parseRepoRevSpec(repo_id, revision, commit_id) + '/.stats';
	}, "POST");

	// Get the build for a specific revspec.
	// USAGE: sourcegraph.repos.get_build(repo_id, [revision], [commit_id], [exact])
	// ROUTE: GET /api/repos/{RepoSpec}/.build?Exact={exact}
	registerRepoMethod("get_build", function(repo_id, revision, commit_id, exact) {
		this.path += parseRepoRevSpec(repo_id, revision, commit_id) + '/.build?Exact=' + (!!exact).toString(); 
	});

	// Create adds the repository at cloneURL, filling in all information about
	// the repository that can be inferred from the URL (or, for GitHub
	// repositories, fetched from the GitHub API). If a repository with the
	// specified clone URL, or the same URI, already exists, it is returned.
	registerRepoMethod("create", function(type, clone_url) {
		this.post_data = querystring.stringify({
			Type: type, 
			CloneURLStr: clone_url
		});
		this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': this.post_data.length
    };
	}, "POST");

	// GetReadme fetches the formatted README file for a repository.
	registerRepoMethod("readme", function(repo_id) {
		this.path += parseRepoSpec(repo_id) + '/.readme'; 
	});

	// List repositories.
	registerRepoMethod("list", function(options) {
		this.path += '?' + querystring.stringify(options); 
	});

	// List commits.
	// TODO: add pagination stuff
	registerRepoMethod("commits", function(repo_id, options) {
		this.path += parseRepoSpec(repo_id) + '/.commits?' + querystring.stringify(options); 
	});

	// GetCommit gets a commit.
	// TODO: check to see if this actually matches spec
	registerRepoMethod("commit", function(repo_id, revision) {
		this.path += parseRepoSpec(repo_id) + '/.commits/' + revision; 
	});

	// ListBranches lists a repository's branches.
	registerRepoMethod("branches", function(repo_id, options) {
		this.path += parseRepoSpec(repo_id) + '/.branches?' + querystring.stringify(options); 
	});

	// ListTags lists a repository's tags.
	registerRepoMethod("tags", function(repo_id, options) {
		this.path += parseRepoSpec(repo_id) + '/.tags?' + querystring.stringify(options); 
	});

	// ListBadges lists the available badges for repo.
	registerRepoMethod("badges", function(repo_id, options) {
		this.path += parseRepoSpec(repo_id) + '/.badges?' + querystring.stringify(options); 
	});

	// ListCounters lists the available counters for repo.
	registerRepoMethod("counters", function(repo_id, options) {
		this.path += parseRepoSpec(repo_id) + '/.counters?' + querystring.stringify(options); 
	});

	// List people who have contributed (i.e., committed) code to the repo.
	registerRepoMethod("authors", function(repo_id, revision, commit_id, options) {
		this.path += parseRepoRevSpec(repo_id, revision, commit_id) + '/.authors?' + querystring.stringify(options);
	});

	// ListClients lists people who reference defs defined in repo.
	registerRepoMethod("counters", function(repo_id, options) {
		this.path += parseRepoSpec(repo_id) + '/.clients?' + querystring.stringify(options); 
	});

	// ListDependents lists repositories that contain defs referenced by
	// repo.
	registerRepoMethod("dependencies", function(repo_id, revision, commit_id, options) {
		this.path += parseRepoRevSpec(repo_id, revision, commit_id) + '/.dependencies?' + querystring.stringify(options); 
	});

	// ListDependents lists repositories that reference defs defined in repo.
	registerRepoMethod("counters", function(repo_id, options) {
		this.path += parseRepoSpec(repo_id) + '/.counters?' + querystring.stringify(options); 
	});
}