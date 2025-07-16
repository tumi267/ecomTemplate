/*
  Warnings:

  - You are about to drop the column `label` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Variant` table. All the data in the column will be lost.
  - Added the required column `qty` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackQty` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "qty" INTEGER NOT NULL,
ADD COLUMN     "trackQty" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "label",
DROP COLUMN "type",
ADD COLUMN     "options" JSONB NOT NULL;
