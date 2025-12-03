"""add_profile_fields

Adds bio, profile_picture, and phone fields to users table

Revision ID: add_profile_fields
Create Date: 2024-12-03
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'add_profile_fields'
down_revision = None  # Update this to the previous migration if exists
branch_labels = None
depends_on = None


def upgrade():
    """Add profile fields to users table."""
    op.add_column('users', sa.Column('bio', sa.String(), nullable=True))
    op.add_column('users', sa.Column('profile_picture', sa.String(), nullable=True))
    op.add_column('users', sa.Column('phone', sa.String(), nullable=True))


def downgrade():
    """Remove profile fields from users table."""
    op.drop_column('users', 'phone')
    op.drop_column('users', 'profile_picture')
    op.drop_column('users', 'bio')
