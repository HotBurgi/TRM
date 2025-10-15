import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});
		const mod = await import('@tailwindcss/vite');
		const factory = mod.default ?? mod.tailwindcss ?? mod;
		if (typeof factory === 'function') tailwindPlugin = factory();
	} catch (error) {
		console.warn('Optional Tailwind plugin not found, continuing without it.');
	}

	return {
		plugins: [tailwindPlugin, sveltekit()].filter(Boolean)
	};
});
