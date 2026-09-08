-- AlterTable
ALTER TABLE "environments" ADD COLUMN     "slots" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "placements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "slot_index" INTEGER NOT NULL,
    "car_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "placements_user_id_environment_id_slot_index_key" ON "placements"("user_id", "environment_id", "slot_index");

-- CreateIndex
CREATE UNIQUE INDEX "placements_user_id_environment_id_car_id_key" ON "placements"("user_id", "environment_id", "car_id");

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
