boot:
	npx release-please bootstrap \
        --token=$(token) \
        --repo-url=rem-tools/nuxt-ory \
        --package-name=$(packageName) \
        --bump-minor-pre-major=true \
        --release-type=$(releaseType) \
        --initial-version=1.0.0

release:
	npx release-please release-pr \
      --token=$(token) \
      --repo-url=rem-tools/nuxt-ory \
      --package-name=$(packageName)
