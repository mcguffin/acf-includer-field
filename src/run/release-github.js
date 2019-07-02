/*
Set version in files
*/

const wp = require('./lib/wp-release.js');
const fs = require('fs');
const glob = require('glob');

const package = require('../../package.json');


const message_data = {
	require_wp:		wp.read_header_tag('readme.txt', 'Requires at least' ),
	max_wp:			wp.read_header_tag('readme.txt', 'Tested up to' ),
	require_php:	wp.read_header_tag('readme.txt', 'Requires PHP' ),
}
const request_data = {
	tag_name:			"v%s" % (new_version),
	target_commitish:	args.branch,
	name:				"%s" % (new_version),
	body:				body,
	draft:				false,
	prerelease:			false
}
tag_url = 'https://api.github.com/repos/%s/%s/releases?access_token=%s' % (repo_owner,repo_name,access_token)
print( repo_owner,repo_name )
# send api request
print('Create tag...')
tag_req = urllib.request.Request( tag_url,
	data = json.dumps(request_data).encode('utf-8'),
	headers = {
		'Authorization' : 'token %s' % (access_token)
	}
)


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
