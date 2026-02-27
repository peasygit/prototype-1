
import { insforge } from '../src/utils/insforge';

async function createBucket() {
  console.log('Inspecting Storage Client...');
  
  // @ts-ignore
  const storage = insforge.storage;
  
  // Check if storage has createBucket
  // @ts-ignore
  if (typeof storage.createBucket === 'function') {
      console.log('Found createBucket on storage instance');
      try {
          // @ts-ignore
          const { data, error } = await storage.createBucket('avatars', { public: true });
          if (error) console.error('createBucket error:', error);
          else console.log('Bucket created:', data);
      } catch (e) {
          console.error('createBucket threw:', e);
      }
  } else {
      console.log('createBucket NOT found on storage instance');
      console.log('Keys:', Object.keys(storage));
      console.log('Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(storage)));
  }

  // Also try listBuckets
  // @ts-ignore
  if (typeof storage.listBuckets === 'function') {
      try {
          // @ts-ignore
          const { data, error } = await storage.listBuckets();
          console.log('Buckets:', data);
          if (error) console.error('listBuckets error:', error);
      } catch (e) {
           console.error('listBuckets threw:', e);
      }
  }
}

createBucket();
