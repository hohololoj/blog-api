import { Module } from "@nestjs/common";
import { FSService } from "./fs.service";

@Module({
	providers: [FSService],
	exports: [FSService]
})
export class FSModule{}