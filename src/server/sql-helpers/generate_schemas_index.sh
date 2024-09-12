#!/bin/bash

# Bash is hard to read! 
# This creates a config file to determine what schemas are valid for the query helper functions.

INDEX_FILE="./schemas_index.json"

OUTPUT_FILE="./tables.json"

echo "{" > $OUTPUT_FILE

first_entry=false

while IFS= read -r schema_path; do
    while IFS= read -r line; do
        if [[ $line =~ ^CREATE[[:space:]]TABLE[[:space:]]([a-zA-Z_][a-zA-Z0-9_]*) ]]; then
            table_name=${BASH_REMATCH[1]}
            if [[ "$first_entry" == false ]]; then
                echo "  \"${table_name}\": \"${table_name}\"" >> $OUTPUT_FILE
                first_entry=true
            else
                echo ",\"${table_name}\": \"${table_name}\"" >> $OUTPUT_FILE
            fi
        fi
    done < "$schema_path"
done < <(jq -r '.[]' $INDEX_FILE)

echo "}" >> $OUTPUT_FILE

echo "Configuration file generated at $OUTPUT_FILE"