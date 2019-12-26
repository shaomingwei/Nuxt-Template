<template>
	<div>
		<span>{{name}}</span>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Prop} from 'nuxt-property-decorator'
	@Component
	export default class Logo extends Vue {
		@Prop({ default: '' }) name?: string | number;
	}
</script>
