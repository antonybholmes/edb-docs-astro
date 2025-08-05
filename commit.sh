msg=$1 #"Bug fixes and updates."
type=$2
branch=$3


if [[ -z "${msg}" ]]
then
	msg="Bug fixes and updates."
fi

if [[ -z "${type}" ]]
then
	type="Changed"
fi

if [[ -z "${branch}" ]]
then
	branch="dev"
fi

 
pnpm update-version
#tsx scripts/update-changelog.ts "${msg}" "${type}"
#pnpm make-changelog-markdown
#pnpm make-help-toc

./base_commit.sh -t "${type}" -m "${msg}" -b dev
