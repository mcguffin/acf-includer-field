/*
Set version in files
*/

const wp = require('./lib/wp-release.js');
const fs = require('fs');
const glob = require('glob');
const git = require('simple-git')('.');

const package = require('../../package.json');

let branch;
let repo;


const init = async () => git
	.listRemote(['--get-url'], (err,res) => {
		repo = res.match(/git@github\.com:(.*)\.git/)[1];
	})
	.branch( (err,res) => {
		branch = res.current;
	});

init().then();

// git.branch( (err,res) => {
// 	branch = res.current;
// 	// ... add and commit
//
// 	const data = {
// 		version:		package.version,
// 		branch:			branch,
// 		require_wp:		wp.read_header_tag('readme.txt', 'Requires at least' ),
// 		max_wp:			wp.read_header_tag('readme.txt', 'Tested up to' ),
// 		require_php:	wp.read_header_tag('readme.txt', 'Requires PHP' ),
// 	}
//
// 	const req_data = {
// 		tag_name:			package.version,
// 		target_commitish:	branch,
// 		name:				package.version,
// 		body:				`Release ${data.version} from ${data.branch}
//
// Requires at least: ${data.require_wp}
// Tested up to: ${data.max_wp}
// Requires PHP: ${data.require_php}`,
// 		draft:				false,
// 		prerelease:			false
// 	}
// 	git.push( () => {
//
// 	});
//
//
// });

//
//
// tag_url = 'https://api.github.com/repos/%s/%s/releases?access_token=%s' % (repo_owner,repo_name,access_token)
// print( repo_owner,repo_name )
// # send api request
// print('Create tag...')
// tag_req = urllib.request.Request( tag_url,
// 	data = json.dumps(request_data).encode('utf-8'),
// 	headers = {
// 		'Authorization' : 'token %s' % (access_token)
// 	}
// )


/*
Release pipeline:

A. Sources (Always)
`npm run release [major|minor|patch]`
 - [x] Build i18n => npm run i18n
 - [ ] Increment versions (readme.txt, package.json, style.css, src/scss/style.scss, main plugin file, languages/xxx.pot)
 - [ ] Build assets => $ gulp build
 - [ ] commit -m "release x.y.z"
 - [ ] push
 - [ ] create release via http api

B. Release to wp.org
 - clone svn to tmp/
 - download to trunk/
 - copy assets from .wordpress.org/ > tmp/svn-repo/assets/
 - add/rm/...
 - svn cp trunk/ tags/x.y.z/
 - svn ci -m "release x.y.z"
 - rm -rf tmp/

*/

// upgrade plugin version
// console.log(wp.find_package_files())
// wp.write_header_tag( wp.find_package_file(), 'Version', version );
// try {
// 	wp.write_header_tag( './readme.txt', 'Stable tag', version );
// } catch {
// 	console.log('no readme.txt')
// }
