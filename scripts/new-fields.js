    fieldMap.set(norm(f.name), f.id);
    fieldMap.set(f.slug, f.id);
  }

  for (const f of FIELDS_CONFIG) {
    let fieldId = fieldMap.get(f.slug) || fieldMap.get(norm(f.name));
    if (fieldId) {
      await prisma.field.update({
        where: { id: fieldId },
        data: { name: f.name, category: f.category },
      });
    } else {
      const field = await prisma.field.create({
        data: { name: f.name, slug: f.slug, category: f.category },
      });
      fieldId = field.id;
      fieldMap.set(norm(field.name), field.id);
      fieldMap.set(field.slug, field.id);
    }

    // Seed specializations
    for (const specName of f.specializations) {
      const specSlug = norm(specName);
      await prisma.specialization.upsert({
        where: { fieldId_name: { fieldId, name: specName } },
        update: { slug: specSlug },
        create: { name: specName, slug: specSlug, fieldId },
      });
    }
  }

