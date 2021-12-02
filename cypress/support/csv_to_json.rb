require 'csv'
require 'json'

input_csv = 'cypress/fixtures/sample_praise.csv'
output_json = 'cypress/fixtures/sample_praise_array.json'
result = "[\n"
CSV.open(input_csv, "rb:UTF-8", headers: true, header_converters: :symbol) do |file|
	file.each do |line|
		result += "{
			\"giver\": { 
				\"id\": \"#{line[:to].split('#')[1]}\",
				\"username\": \"#{line[:to].split('#')[0]}\",
				\"profileImageURL\": \"\",
				\"platform\": \"DISCORD\"
			},
			\"recipients\": [
				{ 
					\"id\": \"#{line[:from].split('#')[1]}\",
					\"username\": \"#{line[:from].split('#')[0]}\",
					\"profileImageURL\": \"\",
					\"platform\": \"DISCORD\"
				}
			],
			\"praiseReason\": \"#{line[:reason]}\",
			\"source\": {
				\"id\": \"#{line[:source_id]}\",
				\"name\": \"#{line[:source_name]}\",
				\"channelId\": \"#{line[:channel_id]}\",
				\"channelName\": \"#{line[:channel_name]}\",
				\"platform\": \"DISCORD\"
			}
		}, "
  end
  result += "\n]"
end
puts result
File.open(output_json, "w") { |f|
	f.write result
}
