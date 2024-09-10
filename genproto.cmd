start protoc --proto_path=./proto ^
--plugin=protoc-gen-ts_proto=E:/game/slot/node_modules/.bin/protoc-gen-ts_proto.cmd ^
--ts_proto_opt=esModuleInterop=true ^
--ts_proto_out=paths=source_relative:./genproto 