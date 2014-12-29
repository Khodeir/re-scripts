import sys
import BeautifulSoup as bs
import requests

def parse_page(url):
	response = requests.get(url)
	soup = bs.BeautifulSoup(response.text)
	data_attrs = {'name':'span', 'attrs':{'class':'SearchPropDetdata2'}}
	delim_attrs = {'name':'img', 'attrs':{'src':'http://1-ps.googleusercontent.com/hk/ix1vg50tyxovUb0rNenGGAwiqY/www.realestateegypt.com/images/Seprator.gif.pagespeed.ce.5YcPrGm4MrY7gf2l6nF3.gif'}}
	current_node = soup.find(**data_attrs)

	assert current_node, 'Failed to find any data on page.'

	all_fields = []

	while current_node.findNext(**data_attrs):
		current_field = []
		#accumulate all parts of the current field
		while True:
			current_field_content = current_node.getText(':').replace('\r\n',' ')
			if current_field_content:
				current_field.append(current_field_content)

			next_data = current_node.findNext(**data_attrs)
			next_delim = current_node.findNext(**delim_attrs)


			if not next_data:
				break
			if (not next_delim) or (next_data.findNext(**delim_attrs) is next_delim):
				#this is part of this field
				current_node = next_data
			else:
				#done with current field
				current_node = next_delim
				break
		all_fields.append(u','.join(current_field))
	return all_fields

while True:
	url = sys.stdin.readline().strip('\n')
	if url == 'END':
		break
	print u'||'.join(parse_page(url)).encode('utf-8')
