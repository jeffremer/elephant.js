begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

begin
  require 'rocco/tasks'
  Rocco::make 'docs/', 'src/*.js', {
      :language => 'javascript',
      :comment_chars => '//'
  }  
rescue LoadError
  task :rocco do
    abort "Rocco isn't available. In order to build docs, you must: (sudo) gem install rocco"
  end
end