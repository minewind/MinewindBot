setup:
	npm i
	# Due to how minewind sends some malformed packets, we need to be able to
	# not crash when parsing those. So, *thankfully* applying this patch in the
	# compiler fixes things
	# Source: https://github.com/PrismarineJS/mineflayer/issues/3573#issuecomment-2629615309
	perl -0777 -i.original -pe 's/const \{ value, size \} = tryCatch.*(\n.*){10}/ try \{\n const \{ value, size\} = this.read\(buffer, offset, type\)\nreturn \{ data: value, metadata: \{ size \}, buffer: buffer.slice\(0, size\), fullBuffer: buffer \}\n\} catch \(e\)\{\nconsole.warn\(`Ignoring large array size error: \$\{e.message\}`\)\nreturn \{ data: \[\], metadata: \{ size: buffer\.length \}, buffer: buffer, fullBuffer: buffer \} \}/' node_modules/protodef/src/compiler.js
run:
	npm run start
prod:
	npm run prod
