import json
f = open('../dataset/annotation_original.json')
data = json.load(f)
with open('../dataset/annotation.json', 'w') as new_file:
    new_file.write('[')
    for index, i in enumerate(data):
        if len(i['Label']['objects']) == 1:
            json.dump(i,new_file)
            if not index == len(data)-1:
                new_file.write(',')
            new_file.write('\n')
    new_file.write(']')
f.close()
