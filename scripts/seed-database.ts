import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with sample CS2 skin data...')

  const sampleSkins = [
    {
      name: '★ Karambit Vanilla',
      marketHashName: '★ Karambit Vanilla',
      rarity: 'Covert',
      category: 'knife',
      weapon: 'Karambit',
      skin: 'Vanilla',
      collection: 'The 2018 Inferno Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: false,
      isSouvenir: false,
      isNormal: true,
      age: "120",
      steamPrice: 15000.00,
      buffPrice: 14500.00,
      csMoneyPrice: 14800.00,
      bitskinsPrice: 15200.00
    },
    {
      name: 'MAC-10 Bronzer',
      marketHashName: 'MAC-10 | Bronzer',
      rarity: 'Classified',
      category: 'weapon',
      weapon: 'MAC-10',
      skin: 'Bronzer',
      collection: 'The 2021 Dust 2 Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 673,
      isStatTrak: true,
      isSouvenir: false,
      isNormal: false,
      age: "90",
      steamPrice: 13000.00,
      buffPrice: 12800.00,
      csMoneyPrice: 12900.00,
      bitskinsPrice: 13100.00
    },
    {
      name: 'AUG Eye of Zapems',
      marketHashName: 'AUG | Eye of Zapems',
      rarity: 'Restricted',
      category: 'weapon',
      weapon: 'AUG',
      skin: 'Eye of Zapems',
      collection: 'The 2018 Nuke Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: false,
      isSouvenir: false,
      isNormal: true,
      age: "150",
      steamPrice: 9000.00,
      buffPrice: 8800.00,
      csMoneyPrice: 8900.00,
      bitskinsPrice: 9100.00
    },
    {
      name: 'CZ75-Auto Midnight Palm',
      marketHashName: 'CZ75-Auto | Midnight Palm',
      rarity: 'Industrial',
      category: 'weapon',
      weapon: 'CZ75-Auto',
      skin: 'Midnight Palm',
      collection: 'The 2021 Mirage Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: false,
      isSouvenir: false,
      isNormal: true,
      age: "60",
      steamPrice: 500.00,
      buffPrice: 480.00,
      csMoneyPrice: 490.00,
      bitskinsPrice: 510.00
    },
    {
      name: 'AK-47 | Redline',
      marketHashName: 'AK-47 | Redline',
      rarity: 'Classified',
      category: 'weapon',
      weapon: 'AK-47',
      skin: 'Redline',
      collection: 'The 2018 Train Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: false,
      isSouvenir: false,
      isNormal: true,
      age: "180",
      steamPrice: 7500.00,
      buffPrice: 7400.00,
      csMoneyPrice: 7450.00,
      bitskinsPrice: 7600.00
    },
    {
      name: 'M4A4 | Asiimov',
      marketHashName: 'M4A4 | Asiimov',
      rarity: 'Covert',
      category: 'weapon',
      weapon: 'M4A4',
      skin: 'Asiimov',
      collection: 'The 2018 Dust 2 Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: true,
      isSouvenir: false,
      isNormal: false,
      age: "200",
      steamPrice: 12000.00,
      buffPrice: 11800.00,
      csMoneyPrice: 11900.00,
      bitskinsPrice: 12100.00
    },
    {
      name: '★ Butterfly Knife | Fade',
      marketHashName: '★ Butterfly Knife | Fade',
      rarity: 'Covert',
      category: 'knife',
      weapon: 'Butterfly Knife',
      skin: 'Fade',
      collection: 'The 2018 Cache Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: false,
      isSouvenir: false,
      isNormal: true,
      age: "160",
      steamPrice: 25000.00,
      buffPrice: 24500.00,
      csMoneyPrice: 24700.00,
      bitskinsPrice: 25200.00
    }
  ]

  for (const skin of sampleSkins) {
    const createdSkin = await prisma.item.upsert({
      where: { marketHashName: skin.marketHashName },
      update: skin,
      create: skin
    })

    // Add some sample stickers for certain skins
    if (skin.name.includes('AK-47') || skin.name.includes('M4A4')) {
      await prisma.sticker.createMany({
        data: [
          { name: 'Titan (Holo) | Katowice 2014', slot: 1, itemId: createdSkin.id },
          { name: 'iBUYPOWER (Holo) | Katowice 2014', slot: 2, itemId: createdSkin.id },
          { name: 'Vox Eminor (Holo) | Katowice 2014', slot: 3, itemId: createdSkin.id },
          { name: 'LGB eSports (Holo) | Katowice 2014', slot: 4, itemId: createdSkin.id }
        ]
      })
    }

    // Add charms for some skins
    if (skin.name.includes('Karambit') || skin.name.includes('Butterfly')) {
      await prisma.charm.createMany({
        data: [
          { name: 'Golden Coin', itemId: createdSkin.id },
          { name: 'Diamond Trophy', itemId: createdSkin.id }
        ]
      })
    }

    console.log(`Created/Updated: ${skin.name}`)
  }

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 