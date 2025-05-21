<template>
  <div class="modal-overlay" @click.self="closeModal" v-if="visible">
    <div class="modal-content">
      <div class="modal-header">
        <h2>选择收藏夹组件</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <ul v-if="favorites.length > 0">
          <li 
            v-for="(favorite, index) in favorites" 
            :key="index"
            @click="selectFavorite(favorite)"
          >
            <!-- Display the favorite name -->
            <div>{{ favorite.name }}</div>
            <!-- TODO: Add a more sophisticated preview -->
          </li>
        </ul>
      </div>
       <div class="modal-footer">
        <button @click="closeModal">取消</button>
        <!-- TODO: Add a confirmation button if multiple selection is allowed -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { PPTElement } from '@/types/slides'

// Assuming FavoriteItem is defined in useFavoriteComponents and includes 'name'
import type { FavoriteItem } from '@/hooks/useFavoriteComponents'

const props = defineProps<{
  visible: boolean;
  favorites: FavoriteItem[]; // Use FavoriteItem type
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'select-favorite', elements: PPTElement[]): void;
}>()

const closeModal = () => {
  console.log('closeModal called')
  emit('update:visible', false)
  console.log('update:visible emitted')
}

// Function to handle favorite selection
const selectFavorite = (favorite: FavoriteItem) => {
  // Emit the elements array part of the FavoriteItem
  emit('select-favorite', favorite.elements)
  closeModal()
}

// TODO: Implement selection logic
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.modal-header h2 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.modal-body ul {
  list-style: none;
  padding: 0;
}

.modal-body li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.modal-body li:last-child {
  border-bottom: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.modal-footer button {
  margin-left: 10px;
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.modal-footer button:hover {
  background-color: #f0f0f0;
}
</style>
