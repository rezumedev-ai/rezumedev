
#!/bin/bash

# List of files to update
FILES=(
    "src/pages/About.tsx"
    "src/pages/Blog.tsx"
    "src/pages/BlogPost.tsx"
    "src/pages/Careers.tsx"
    "src/pages/Contact.tsx"
    "src/pages/Cookies.tsx"
    "src/pages/Features.tsx"
    "src/pages/Guides.tsx"
    "src/pages/Index.tsx"
    "src/pages/PaymentSuccess.tsx"
    "src/pages/Pricing.tsx"
    "src/pages/Privacy.tsx"
    "src/pages/Terms.tsx"
)

# Function to update imports
update_import() {
    sed -i 's/import { Header } from "@\/components\/Header"/import Header from "@\/components\/Header"/g' "$1"
}

# Update imports in each file
for file in "${FILES[@]}"; do
    update_import "$file"
done

echo "Header import updates complete."
