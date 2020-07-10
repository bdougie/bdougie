#!/usr/bin/env ruby
#/ Usage: ./action/update-photos
#/ Update the local README photo wall to reflect the current developers listed in
# bdougie/awesome-black-developers.
require "yaml"
require "json"
require "octokit"


class Readme
  DEFAULT_README = "README.md"

  # Fetch the repo owner

  def initialize(filename: DEFAULT_README)
    client = Octokit::Client.new
    @filename = filename
    @developers = read_developer_yaml.merge(read_temp_file)
    @user = client.user 'bdougie'
  end

  def read_developer_yaml
    file = File.open('developers.yaml')
    file_data = file.read
    file.close
    YAML::load(file_data)
  end

  def read_temp_file
    file = File.open('temp.txt')
    handle = ""
    links = []
    file_data = file.readlines.each_with_index.map do |line, index|
      if index == 0
        handle =line.gsub("#", "").strip
      else
        if !line.nil? && !line.strip.empty?
          links.push(line.gsub("*", "").strip)
        end
      end
    end
    {handle => links}
  end

  def update_developer_yaml
    yaml = @developers.to_yaml
    File.write('developers.yaml', yaml)
  end

  def preview
    [
      "<img align="right" src="monadance.gif" width="200"/>",
      "# 🍕 bdougie's Top 8 Page🍕",
      "## bdougie has #{@user.followers} followers",
      build_photo_grid(@developers),
    ].join("\n\n")
  end

  def save!
    update_developer_yaml
    File.write(@filename, preview)
  end
end

def build_photo_grid(users)
  lines = []

  users.map{|k, v| k}.each_slice(4).each_with_index do |slice, index|
    if index <= 1
      header = slice.map { |e| handle_link(e) }.join(" | ").strip
      delimiter = slice.map { |e| "---" }.join(" | ")
      row = slice.map { |e| photo_link(e) }.join(" | ").strip

      lines += [header, delimiter, row, ""]
    end
  end

  lines.join("\n")
end

def build_developer_list(users)
  row = users.map do |handle, links|
    developer_row = []
    developer_row.push("### [@#{handle}](https://github.com/#{handle})")
    links.each do |link|
      developer_row.push(" * #{link}")
    end
    developer_row.join("\n")
  end
  row.join("\n\n")
end

def handle_link(login)
  "[@#{login}](##{login})"
end

def photo_link(login)
  "![@#{login}](https://avatars.githubusercontent.com/#{login}?s=150&v=1)"
end

def update_readme(save: false)
  readme = Readme.new
  save ? readme.save! : (puts readme.preview)
end

update_readme(save: true)
