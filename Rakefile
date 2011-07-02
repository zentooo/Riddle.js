closure_command = "closure "
plugins = Dir.glob("./src/*.js").reject { |f| f =~ /riddle|min/ }
jsfiles = ["./src/riddle.js"].concat(plugins)
jsdoc_path = ENV["HOME"] + "/Dropbox/jsdoc-toolkit"

task :default => [:build, :build_all, :doc, :show]
task :min => [:build, :build_all]

task :build do
  sh closure_command + "--js ./src/riddle.js > ./src/riddle.min.js"
end

task :build_all do
  sh closure_command + jsfiles.map { |f| "--js " + f }.join(" ") + " > src/riddle-all.min.js"
end

task :doc do
  sh "rm -rf ./doc/*"
  sh "java -jar #{jsdoc_path}/jsrun.jar #{jsdoc_path}/app/run.js -a -t='#{jsdoc_path}/templates/jsdoc' " + jsfiles.join(" ") + " -d=./doc"
  sh "git add 'doc/*'"
end

task :show do
  sh "ls -lh ./src"
end

namespace "test" do
  task :clean do
    sh "cd ./test; rm riddle.js riddle-all.js"
  end

  task :normal => ["test:clean"] do
    sh "cd ./test; ln -s ../src/riddle.js riddle.js;"
    sh "cat " + jsfiles.join(" ") + " > ./test/riddle-all.js"
  end

  task :min => ["test:clean"] do
    sh "cd ./test; ln -s ../src/riddle.min.js riddle.js; ln -s ../src/riddle-all.min.js riddle-all.js"
  end
end
