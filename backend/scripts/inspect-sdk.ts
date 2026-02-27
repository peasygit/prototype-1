
import { insforge } from '../src/utils/insforge';

async function inspect() {
  console.log('InsForge Storage Keys:', Object.keys(insforge.storage));
  console.log('InsForge Storage Prototype:', Object.getPrototypeOf(insforge.storage));
  try {
      // Try to list buckets using standard Supabase v2 syntax
      const { data, error } = await insforge.storage.listBuckets();
      console.log('listBuckets result:', { data, error });
  } catch (e) {
      console.log('listBuckets failed:', e.message);
  }
}

inspect();
