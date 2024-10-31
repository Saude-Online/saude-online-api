-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserSpecialties" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSpecialties_AB_unique" ON "_UserSpecialties"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSpecialties_B_index" ON "_UserSpecialties"("B");

-- AddForeignKey
ALTER TABLE "_UserSpecialties" ADD CONSTRAINT "_UserSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSpecialties" ADD CONSTRAINT "_UserSpecialties_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
