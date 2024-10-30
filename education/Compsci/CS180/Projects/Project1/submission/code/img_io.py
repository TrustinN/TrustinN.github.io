import os

complement = {
    "{": "}",
    "[": "]",
    "(": ")",
    "}": "{",
    "]": "[",
    ")": "(",
}


# Convert tuple in string format to tuple class
def read_tuple(tuple_str, *args):
    entries = []
    delimeters = {"{": 0, "}": 0, "[": 0, "]": 0, "(": 0, ")": 0}
    tuple_str = tuple_str[1:-1]
    unpaired = 0
    start = 0
    for i in range(len(tuple_str)):
        curr_char = tuple_str[i]
        if curr_char in delimeters:
            delimeters[curr_char] += 1
            pair = complement[curr_char]
            if delimeters[curr_char] == delimeters[pair]:
                unpaired -= 1
            elif delimeters[curr_char] - 1 == delimeters[pair]:
                unpaired += 1
        if curr_char == "," and unpaired == 0:
            entries.append(tuple_str[start:i])
            start = i + 1
    entries.append(tuple_str[start:])

    if len(args) == 0:
        args = [int for i in range(len(entries))]
    if len(args) != len(entries):
        print("Invalid read_tuple input: Incorrect number of types given")

    return tuple([args[i](entries[i]) for i in range(len(entries))])


# Read in formatted data to dictionary. Used to add on existing data to a text file.
class DataIO():
    def __init__(self, path):
        self.file_open = False
        self.file = None
        self.data = {}

        self.path = path
        self.open_file()
        self.get_data()

    def open_file(self):
        if not self.file_open:
            self.file_open = True
            if not os.path.exists(self.path):
                with open(self.path, 'w') as f:
                    f.write("")
            self.file = open(self.path, 'r+')

        else:
            print("Close file before opening another one")

    def close_file(self):
        self.file_open = False
        self.file.close()

    def get_data(self):
        for line in self.file.readlines():
            entries = line.split(" ")
            key, value = entries
            value = read_tuple(value.rstrip(), read_tuple, read_tuple, float)
            self.data[key] = value
        self.file.seek(0)

    def append_data(self, key, value):
        self.data[key] = value

    def write_data(self):
        self.file.truncate(0)
        output = ""
        for key, value in self.data.items():
            output = output + key + " " + str(value).replace(" ", "") + "\n"
        self.file.write(output.rstrip())




