-- AlterTable
ALTER TABLE "cars" ALTER COLUMN "original_image_url" DROP NOT NULL,
ALTER COLUMN "pixel_image_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "environments" ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "background_url" DROP NOT NULL;
