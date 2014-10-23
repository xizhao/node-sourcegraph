var assert = require("assert"),
		sourcegraph = require("../lib/sourcegraph.js");

describe('repos', function(){
  describe('get', function(){
    it('should properly fetch a repository by path', function(done){
      sourcegraph.repos.get('github.com/learnboost/mongoose', function(err, doc) {
      	if(err) throw err;
      	assert.notEqual(doc, null);
      	assert.equal(doc.RID, 111891);
      	assert.equal(doc.Name, 'mongoose');
      	done();
      })
    })

    it('should properly return a 404 when fetching a missing repository', function(done){
      sourcegraph.repos.get('NONEXISTENT_REPO_PATH', function(err, doc) {
      	assert.equal(err.message, "404 page not found\n");
      	assert.strictEqual(doc, undefined);
      	done();
      })
    })
  })

  describe('dependencies', function(){
  	it('should properly fetch deps', function(err, doc) {
  		sourcegraph.repos.dependencies('github.com/tangentlabs/django-oscar', '5f64fd5', function(err, docs) {
  			assert.equal(docs.length, 10);
      	done();
  		});
  	});
  });
})